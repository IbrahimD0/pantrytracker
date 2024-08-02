"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";
import Image from "next/image";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="pt-12">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6 bg-white rounded-lg">
        <div className="grid gap-4">
          <Image
            src=""
            alt="Pantry Item"
            width={600}
            height={600}
            className="aspect-square object-cover border w-full rounded-lg overflow-hidden contain"
          />
        </div>
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl">{params.id}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 fill-primary" />
                <span className="text-lg font-medium">2 lbs</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 fill-primary" />
                <span className="text-lg font-medium">Expires: 2024-12-31</span>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-base">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this pantry item..."
                className="resize-none"
              />
            </div>
            <Button size="lg">Recipes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
