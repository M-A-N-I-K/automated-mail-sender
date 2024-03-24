import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "./_components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuroraBackground showRadialGradient className="overflow-scroll">
			<Navbar />
			<main className="w-full p-8 flex justify-center items-center">
				{children}
			</main>
		</AuroraBackground>
	);
};

export default MainLayout;
