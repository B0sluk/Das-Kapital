export default function QRCode({ size = 130, url = "https://das-kapital.vercel.app" }) {
  const apiUrl =
    `https://api.qrserver.com/v1/create-qr-code/` +
    `?size=${size}x${size}` +
    `&data=${encodeURIComponent(url)}` +
    `&color=cc1111` +
    `&bgcolor=0f0f0f` +
    `&qzone=1` +
    `&format=svg`;

  return (
    <img
      src={apiUrl}
      width={size}
      height={size}
      style={{ display: "block", borderRadius: 4 }}
      alt="QR Code"
    />
  );
}
