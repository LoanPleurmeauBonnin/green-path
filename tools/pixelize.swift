// pixelize.swift — transforme une photo en image pixel art pour Green Path (aucune dépendance : ImageIO + CoreGraphics).
//
// Usage : swift tools/pixelize.swift entrée.jpg sortie.js id 48 32 16 [x y w h]
//   id          identifiant du lieu (ex. jardin-des-plantes)
//   48 32       taille de la grille (cases)
//   16          nombre de couleurs de la palette
//   x y w h     recadrage optionnel dans la photo d'origine (pixels), à faire au ratio de la grille
//
// Étapes : recadrage → réduction par moyenne de zones (chaque case = moyenne exacte des pixels qu'elle couvre)
//          → léger renfort du contraste et de la saturation → quantification k-means (déterministe) → fichier JS :
//   GP.IMAGES['id'] = { w: 48, h: 32, palette: ['#rrggbb', …], data: '<w×h indices en hexadécimal, ligne par ligne>' };
// Un fichier .js (et non une image) se charge aussi en file:// sans blocage du navigateur.

import Foundation
import CoreGraphics
import ImageIO

let a = CommandLine.arguments
guard a.count >= 7 else {
    print("usage: swift pixelize.swift entrée.jpg sortie.js id W H K [x y w h]"); exit(1)
}
let (input, output, id) = (a[1], a[2], a[3])
let (GW, GH, K) = (Int(a[4])!, Int(a[5])!, Int(a[6])!)

guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: input) as CFURL, nil),
      var img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("image illisible"); exit(1) }
if a.count >= 11, let x = Int(a[7]), let y = Int(a[8]), let w = Int(a[9]), let h = Int(a[10]) {
    guard let c = img.cropping(to: CGRect(x: x, y: y, width: w, height: h)) else { print("recadrage impossible"); exit(1) }
    img = c
}

// 1. Pixels RGBA de la photo recadrée
let W = img.width, H = img.height
var px = [UInt8](repeating: 0, count: W * H * 4)
let cs = CGColorSpaceCreateDeviceRGB()
let ctx = CGContext(data: &px, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: cs,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: W, height: H))

// 2. Moyenne de zone pour chaque case (la ligne 0 du tampon est le haut de l'image)
var cells = [[Double]]()
for gy in 0..<GH {
    for gx in 0..<GW {
        let x0 = gx * W / GW, x1 = max(x0 + 1, (gx + 1) * W / GW)
        let y0 = gy * H / GH, y1 = max(y0 + 1, (gy + 1) * H / GH)
        var r = 0.0, g = 0.0, b = 0.0, n = 0.0
        for y in y0..<y1 { for x in x0..<x1 {
            let i = (y * W + x) * 4
            r += Double(px[i]); g += Double(px[i + 1]); b += Double(px[i + 2]); n += 1
        } }
        cells.append([r / n, g / n, b / n])
    }
}

// 3. Contraste (+12 %) et saturation (+20 %), bornés à 0–255
func clamp(_ v: Double) -> Double { return min(255, max(0, v)) }
cells = cells.map { c in
    let l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
    return c.map { v in clamp(((l + (v - l) * 1.2) - 128) * 1.12 + 128) }
}

// 4. k-means : départ déterministe (couleurs les plus éloignées les unes des autres), 30 itérations
func d2(_ p: [Double], _ q: [Double]) -> Double { return (p[0]-q[0])*(p[0]-q[0]) + (p[1]-q[1])*(p[1]-q[1]) + (p[2]-q[2])*(p[2]-q[2]) }
var centers = [cells[cells.count / 2]]
while centers.count < K {
    var best = 0, bestD = -1.0
    for (i, c) in cells.enumerated() { let d = centers.map { d2(c, $0) }.min()!; if d > bestD { bestD = d; best = i } }
    centers.append(cells[best])
}
var label = [Int](repeating: 0, count: cells.count)
for _ in 0..<30 {
    for (i, c) in cells.enumerated() {
        var bi = 0, bd = Double.infinity
        for (k, m) in centers.enumerated() { let d = d2(c, m); if d < bd { bd = d; bi = k } }
        label[i] = bi
    }
    var sum = [[Double]](repeating: [0, 0, 0, 0], count: K)
    for (i, c) in cells.enumerated() { let k = label[i]; sum[k][0] += c[0]; sum[k][1] += c[1]; sum[k][2] += c[2]; sum[k][3] += 1 }
    for k in 0..<K where sum[k][3] > 0 { centers[k] = [sum[k][0] / sum[k][3], sum[k][1] / sum[k][3], sum[k][2] / sum[k][3]] }
}

// 5. Écriture du fichier JS
let palette = centers.map { c in String(format: "'#%02x%02x%02x'", Int(c[0].rounded()), Int(c[1].rounded()), Int(c[2].rounded())) }
let data = label.map { String($0, radix: 16) }.joined()
let js = """
/**
 * Image patrimoniale pixélisée (générée par tools/pixelize.swift, ne pas modifier à la main).
 * Source et licence : voir CREDITS.md.
 */
window.GP = window.GP || {};
GP.IMAGES = GP.IMAGES || {};
GP.IMAGES['\(id)'] = {
  w: \(GW), h: \(GH),
  palette: [\(palette.joined(separator: ", "))],
  data: '\(data)'
};

"""
try! js.write(toFile: output, atomically: true, encoding: .utf8)
print("écrit \(output) : \(GW)×\(GH), \(K) couleurs, recadrage \(W)×\(H)")
