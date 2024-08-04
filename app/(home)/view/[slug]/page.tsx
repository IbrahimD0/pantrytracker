"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import client from "@/utils/pexels/client";
import { NavBar } from "@/components/navbar";

interface Recipe {
  recipe_name: string;
  description: string;
  ingredients: {
    quantity: number;
    quantity_unit : string;
    name: string;
  }[];
  directions: string[];
}
interface Photo {
  src: {
    original: string;
    medium: string;
  };
}

interface PhotosWithTotalResults {
  photos: Photo[];
  total_results: number;
}

interface ErrorResponse {
  error: string;
}
export default function Page({ params }: { params: { slug: string } }) {
  const itemName = params.slug.replace(/%20/g, " ");
  const [image, setImage] = useState<string | null>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const fetchRecipe = async (item: string) => {
    try {
      const response = await fetch(`/api/get_recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: item }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();
      console.log(data.recipe);

      return JSON.parse(data.recipe);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch recipe");
    }
  };

  useEffect(() => {
    const getRecipe = async () => {
      const fetchedRecipe = await fetchRecipe(params.slug);
      setRecipe(fetchedRecipe);
    };
    fetchImageFromPexels(params.slug);
    getRecipe();
  }, [itemName]);

  async function fetchImageFromPexels(itemName: string) {
    try {
      const query = itemName;
      const result: PhotosWithTotalResults | ErrorResponse =
        await client.photos.search({ query, per_page: 1 });

      if ("photos" in result && result.photos.length > 0) {
        const photoUrl = result.photos[0].src.original;
        setImage(photoUrl);
        console.log("Image found:", photoUrl);
      } else {
        console.log("No image found");
      }
    } catch (error) {
      console.error("Error fetching image from Pexels:", error);
    }
  }

  return (
    <>
    <NavBar />
    <div className="pt-12">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6 bg-primary rounded-lg">
        <div className="grid gap-4">
          <Image
            src={image || "/images/pantry-item-placeholder.jpg"}
            alt="Pantry Item"
            width={600}
            height={600}
            className="aspect-square object-cover border w-full rounded-lg overflow-hidden contain"
          />
        </div>
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl capitalize text-accent">{itemName}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 fill-primary" />
                <span className="text-lg font-medium text-secondary">2 lbs</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 fill-primary" />
                <span className="text-lg font-medium text-secondary ">Expires: 2024-12-31</span>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-secondary text-black font-bold" variant="outline">View Recipe</Button>
              </DialogTrigger>
              {recipe && (
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">
                      {recipe.recipe_name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2 ">Ingredients</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary rounded-full" />
                            <p>{`${ingredient.quantity} ${ingredient.quantity_unit   || ''} ${ingredient.name}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Instructions</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        {recipe.directions.map((direction, index) => (
                          <li key={index}>{direction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  <DialogFooter>
                    
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
