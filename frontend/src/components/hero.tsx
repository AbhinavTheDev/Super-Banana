"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Image} from "@unpic/react";
import {Link} from "wouter";
import { cn } from "@/lib/utils";

interface Hero7Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading: string;
  description?: string;
  buttons?: {
    label: string;
    href: string;
    variant?: "default" | "outline";
  }[];
  image?: {
    src: string;
    alt: string;
  };
  className?: string;
}

export function Hero7({
  badge,
  heading,
  description,
  buttons,
  image,
  className,
}: Hero7Props) {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center justify-center pb-8 md:pb-10">
            {badge && (
              <div className="mb-6">
                <Badge variant={badge.variant ?? "secondary"}>
                  {badge.label}
                </Badge>
              </div>
            )}

            {heading && (
              <h1 className="mb-6 text-4xl font-semibold text-balance md:text-6xl max-w-4xl mx-auto">
                {heading}
              </h1>
            )}

            {description && (
              <p className="mb-10 max-w-2xl text-lg text-muted-foreground text-balance md:mb-12">
                {description}
              </p>
            )}

            {buttons && buttons.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant ?? "default"}
                    size="lg"
                    asChild
                  >
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {image && (
            <div className="w-full max-w-4xl px-4">
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={800}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
