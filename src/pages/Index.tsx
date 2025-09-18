import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gradient">Portfolio Test</h1>
          <p className="text-xl text-muted-foreground">If you see this, the basic routing works!</p>
          <div className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">This is a temporary test page to isolate the display issue.</p>
            <div className="p-4 glass rounded-xl border border-border/50">
              <p className="font-medium">Theme and styling are working ✓</p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
