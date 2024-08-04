"use client";
import React, { use } from "react";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import createClerkSupabaseClient from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClerkSupabaseClient();

interface Item {
  id: number;
  name: string;
  count: number;
  user_id: string;
  created_at: string;
}

export const HomePage = () => {
  const router = useRouter();

  const { isSignedIn, user } = useUser();
  const [itemName, setItemName] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPantryItem, setIsPantryItem] = useState(false);
  const handleClick = (name: string) => {
    const lowercasedName = name.toLowerCase();
    router.push(`/view/${lowercasedName}`);
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        const { data: existingUser, error: userError } = await supabase
          .from("User")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error checking user:", userError);
        }

        if (!existingUser) {
          const { data, error } = await supabase.from("User").insert([
            {
              id: user.id,
            },
          ]);
        }

        const { data: items, error } = await supabase
          .from("Item")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching items:", error);
        } else if (items) {
          setItems(items);
        }
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchItems();
    }
  }, [isSignedIn, user, items]);

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const checkIfPantryItem = async (item: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/check_pantry_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: item }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      console.log(data);

      // Assume that `data.response` is a boolean indicating if the item is valid.
      return data.response === "true";
    } catch (error) {
      console.error(error);
      alert("Failed to check pantry item");
      return false;
    }
  };

  const handleAddItem = async () => {
    if (!itemName.trim() || !quantity.trim()) {
      alert("Item name and quantity cannot be empty.");
      return;
    }

    const isPantryItem = await checkIfPantryItem(itemName);

    if (!isPantryItem) {
      alert("Please enter a valid pantry item.");
      return;
    }

    const newItem = {
      name: itemName,
      count: parseInt(quantity),
      user_id: user?.id,
    };

    const { data, error } = await supabase.from("Item").insert([newItem]);

    if (error) {
      console.error("Error inserting item:", error);
    } else {
      setItems([...items, ...(data ?? [])]);
    }

    setItemName("");
    setQuantity("");
  };

  const handleEditItem = async (id: number) => {
    const { error } = await supabase
      .from("Item")
      .update({ name: itemName, count: quantity })
      .eq("id", id);

    if (error) {
      console.error("Error updating item:", error);
    } else {
      console.log("Item updated successfully. item id: ");
      setItems(items.filter((item) => item.id !== id));
    }
  };
  const handleRemoveItem = async (id: number) => {
    const { error } = await supabase.from("Item").delete().eq("id", id);

    if (error) {
      console.error("Error removing item:", error);
    } else {
      console.log("Item removed successfully. item id: ");
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const filteredData = Array.isArray(items)
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="p-12">
        <div className="container xl:min-h-[80vh] max-w-5xl bg-primary rounded-xl p-12 mt-4">
          <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-4 bg-secondary rounded-lg p-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 h-10 rounded-md w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Item name"
                  value={itemName}
                  onChange={handleItemNameChange}
                  className="h-10 rounded-md"
                />
                <Input
                  type="number"
                  placeholder="Item count"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="h-10 rounded-md"
                />
              </div>
              <Button className="h-10 px-4" onClick={handleAddItem}>
                Add
              </Button>
            </div>
            <div className="overflow-auto border rounded-lg bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    {/* <TableHead>Amount</TableHead> */}
                    <TableHead>Date Added</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {!isSignedIn ? (
                          <p>Not signed in</p>
                        ) : loading ? (
                          <span className="loading loading-spinner loading-lg"></span>
                        ) : (
                          <p>You have no items yet.</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="text-primary-100 font-medium "
                      >
                        <TableCell className="font-semibold">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.count}</Badge>
                        </TableCell>
                        {/* <TableCell>${item.count * 10}.00</TableCell>{" "} */}

                        <TableCell>{item.created_at.split("T")[0]}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <Menu className="w-4 h-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleClick(item.name)}
                              >
                                View
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
