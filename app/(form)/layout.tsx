import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "./_components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuroraBackground showRadialGradient>
			<Navbar />
			<main>{children}</main>
		</AuroraBackground>
	);
};

export default MainLayout;
