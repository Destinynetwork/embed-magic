import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Demo from "@/components/Demo";

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Demo />
      </main>
      <Footer />
    </div>
  );
};

export default DemoPage;
