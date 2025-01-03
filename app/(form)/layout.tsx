import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "./_components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuroraBackground showRadialGradient className="overflow-scroll">
			<Navbar />
			<main className="w-full max-w-7xl p-4 sm:p-20 lg:p-24 flex justify-center items-center">
				{children}
			</main>
		</AuroraBackground>
	);
};

export default MainLayout;
