import AnimationViewer from "@/components/AnimationViewer";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <h1 className="text-[40px] md:text-[48px] lg:text-[72px] font-extrabold text-white mb-2 text-center">
        JSON Animation Viewer
      </h1>
      <h2 className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-300 mb-2 text-center">
        Easily preview your JSON animations by dragging them here!
      </h2>
      <p className="text-[12px] md:text-[14px] lg:text-[16px] text-gray-400 mb-6 text-center">
        Your JSON will not be stored on this site. You can rest assured as this
        site has no database.
      </p>
      <AnimationViewer />
    </div>
  );
}
