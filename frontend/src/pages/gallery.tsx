import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Gallery() {
    return (
        <>
            <Navbar />
            <section className="w-full h-[90vh] p-4 space-y-2">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <Tabs defaultValue="grid">
                    <div className="w-full flex justify-end">
                        <TabsList className="rounded-md">
                            <TabsTrigger className="rounded-md" value="grid">Grid</TabsTrigger>
                            <TabsTrigger className="rounded-md" value="list">List</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="grid">
                        Gallery Section Grid
                    </TabsContent>
                    <TabsContent value="list">
                        Gallery Section List
                    </TabsContent>
                </Tabs>
            </section>
        </>
    )
}