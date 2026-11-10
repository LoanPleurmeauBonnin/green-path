// favicon.swift — icônes nettes (plus proche voisin) à partir du logo pixel art (grille 16×16).
// Usage : swift tools/favicon.swift assets/brand/logo.png assets/brand
import Foundation; import CoreGraphics; import ImageIO; import UniformTypeIdentifiers
let a = CommandLine.arguments, dir = a[2]
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!, img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
func render(_ s: Int, from: CGImage) -> CGImage {
  let ctx = CGContext(data: nil, width: s, height: s, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.interpolationQuality = .none; ctx.draw(from, in: CGRect(x: 0, y: 0, width: s, height: s)); return ctx.makeImage()!
}
func save(_ i: CGImage, _ name: String) -> Data {
  let url = URL(fileURLWithPath: dir + "/" + name)
  let d = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(d, i, nil); CGImageDestinationFinalize(d); return try! Data(contentsOf: url)
}
let grid = render(16, from: img)                       // 1 case du logo = 1 pixel
_ = save(render(180, from: grid), "apple-touch-icon.png")
_ = save(render(192, from: grid), "icon-192.png")
_ = save(render(512, from: grid), "icon-512.png")
let p32 = save(render(32, from: grid), "favicon-32.png")
// favicon.ico : un en-tête ICO autour de l'image PNG 32×32 (format accepté par tous les navigateurs récents)
var ico = Data([0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0])
var size = UInt32(p32.count).littleEndian, off = UInt32(22).littleEndian
ico.append(Data(bytes: &size, count: 4)); ico.append(Data(bytes: &off, count: 4)); ico.append(p32)
try! ico.write(to: URL(fileURLWithPath: dir + "/favicon.ico"))
print("icônes écrites dans \(dir)")
