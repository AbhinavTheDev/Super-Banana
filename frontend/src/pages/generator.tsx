import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import FileUpload from "@/components/ui/file-upload";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const ITEMS = new Array(3).fill(null).map((_, index) => index + 1);

export function Generator() {
    const [index, setIndex] = useState(0);
    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row w-full h-[90vh] p-2 gap-2">
                {/* Input Section */}
                <section className="w-full md:w-1/3 h-full border border-border rounded-md">
                    <Form className="p-4 space-y-1">
                        <FileUpload />
                        <FieldGroup className="gap-1.5 mb-2">
                            <Field className="">
                                <FieldLabel className="">Prompt</FieldLabel>
                                <Input placeholder="prompt for generation" className="rounded-md" required />
                            </Field>
                            <Field>
                                <FieldLabel>Select Style</FieldLabel>
                                <Select defaultValue="bold_dramatic">
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bold_dramatic">Bold Dramatic</SelectItem>
                                        <SelectItem value="clean_minimal">Clean Minimal</SelectItem>
                                        <SelectItem value="vibrant_energetic">Vibrant Energetic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>Choose Generation Count</FieldLabel>
                                <Select defaultValue="1">
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>
                        <Button className="w-full">
                            Generate
                        </Button>
                    </Form>
                </section>
                {/* Output Section */}
                <section className="w-full md:w-2/3 h-full border border-border rounded-md">
                    <Carousel index={index} onIndexChange={setIndex} className="flex items-center justify-center">
                        <CarouselContent className='relative'>
                            {ITEMS.map((item) => {
                                return (
                                    <CarouselItem key={item} className='p-4'>
                                        <div className='flex w-md md:w-2xl aspect-video items-center justify-center border rounded-md border-zinc-200 dark:border-zinc-800'>
                                            {item}
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>
                    <div className='flex w-full justify-center space-x-3 px-4'>
                        {ITEMS.map((item) => {
                            return (
                                <button
                                    key={item}
                                    type='button'
                                    aria-label={`Go to slide ${item}`}
                                    onClick={() => setIndex(item - 1)}
                                    className='h-12 w-12 rounded-md border border-zinc-200 dark:border-zinc-800'
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    )
}