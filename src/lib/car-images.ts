import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "cars");
const PUBLIC_PREFIX = "/uploads/cars/";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_CAR = 10;

const SIGNATURES: { ext: string; check: (buf: Buffer) => boolean }[] = [
  {
    ext: "jpg",
    check: (buf) => buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  },
  {
    ext: "png",
    check: (buf) =>
      buf.length > 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a,
  },
  {
    ext: "webp",
    check: (buf) =>
      buf.length > 12 &&
      buf.toString("ascii", 0, 4) === "RIFF" &&
      buf.toString("ascii", 8, 12) === "WEBP",
  },
];

function sniffImage(buffer: Buffer) {
  return SIGNATURES.find((sig) => sig.check(buffer)) ?? null;
}

/**
 * Decodes and saves a browser-submitted `data:image/...;base64,...` string
 * to the local uploads folder. The declared MIME type and any client-supplied
 * filename are never trusted for the saved extension/path — both are
 * re-derived from the actual file bytes (magic-number sniff) and a random
 * id, so this can't be tricked into writing outside the uploads dir or
 * saving a spoofed content type.
 */
export async function saveCarImage(dataUrl: string): Promise<string> {
  const match = /^data:[^;]+;base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data");

  const buffer = Buffer.from(match[1], "base64");
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large or empty");
  }

  const signature = sniffImage(buffer);
  if (!signature) throw new Error("Unsupported image format");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${signature.ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `${PUBLIC_PREFIX}${filename}`;
}

/**
 * Deletes a previously saved car image. Only removes files inside the
 * uploads directory whose name matches the pattern saveCarImage generates —
 * anything else (including a path escaping the directory) is silently
 * ignored, so this can't be used to delete arbitrary filesystem paths.
 */
export async function deleteCarImage(publicPath: string): Promise<void> {
  if (!publicPath.startsWith(PUBLIC_PREFIX)) return;

  const filename = publicPath.slice(PUBLIC_PREFIX.length);
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/i.test(filename)) return;

  const filePath = path.join(UPLOAD_DIR, filename);
  if (path.dirname(filePath) !== UPLOAD_DIR) return;

  await unlink(filePath).catch((err) => {
    if (err?.code !== "ENOENT") throw err;
  });
}
