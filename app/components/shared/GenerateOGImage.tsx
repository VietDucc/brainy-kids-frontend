import Image from "next/image";
import { ImageResponse } from "next/og";

export const GenerateOGImage = async (props: {
  title: string;
  description?: string;
  image?: string;
}) => {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <Image
            src={props.image || "https://brainykidslearn.id.vn/logo.png"}
            alt="Logo"
            width="120"
            height="120"
            style={{ marginRight: 32 }}
          />
          <h1
            style={{
              fontSize: 60,
              fontWeight: 800,
              background: "linear-gradient(to bottom right, #3B82F6, #8B5CF6)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Brainy Kids
          </h1>
        </div>
        <h2
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: "#1F2937",
            marginBottom: 20,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {props.title}
        </h2>
        {props.description && (
          <p
            style={{
              fontSize: 24,
              color: "#4B5563",
              textAlign: "center",
              maxWidth: "70%",
              margin: 0,
            }}
          >
            {props.description}
          </p>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
