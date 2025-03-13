import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "JSON Animation Viewer - Preview Your JSON Animations";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "white",
          background: "linear-gradient(to bottom, #111827, #1f2937)",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          JSON Animation Viewer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            textAlign: "center",
            maxWidth: "80%",
            color: "#9ca3af",
          }}
        >
          Preview Your JSON Animations Instantly
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
