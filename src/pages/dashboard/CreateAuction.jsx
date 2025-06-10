import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  Image,
  Tag,
  User,
  FileText,
  Upload,
  Gavel,
  X,
} from "lucide-react";
import { supabase } from "@/SupabaseClient";
import { useAuth } from "@/context/Authcontex";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

// Zod schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  name: z.string().min(5, "Item name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  initialBid: z.number().min(1, "Initial bid must be at least $1"),
  maxBid: z.number().min(1, "Max bid must be at least $1"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  image: z.any().optional(),
  isLive: z.boolean().default(false),
  liveDuration: z.number().optional(),
});

// Categories
const categories = [
  "Electronics & Tech",
  "Fashion & Accessories",
  "Home & Garden",
  "Sports & Recreation",
  "Art & Collectibles",
  "Books & Media",
  "Jewelry & Watches",
  "Automotive",
  "Music & Instruments",
  "Other",
];

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialBid: 0,
      maxBid: 0,
      duration: 24,
      isLive: false,
      liveDuration: 10,
    },
  });

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("auction-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("auction-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to create an auction");
      navigate("/auth");
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading("Creating auction...");

    try {
      let imageUrl = null;
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }

      const endTime = data.isLive
        ? new Date(Date.now() + data.liveDuration * 60 * 1000)
        : new Date(Date.now() + data.duration * 60 * 60 * 1000);

      const { error } = await supabase.from("auctions").insert([
        {
          seller_id: user.id,
          username: data.username,
          category: data.category,
          name: data.name,
          description: data.description,
          initial_bid: data.initialBid,
          max_bid: data.maxBid,
          duration: data.isLive ? data.liveDuration : data.duration,
          image_url: imageUrl,
          status: "active",
          created_at: new Date().toISOString(),
          end_time: endTime.toISOString(),
          is_live: data.isLive,
          live_duration: data.isLive ? data.liveDuration : null,
        },
      ]);

      if (error) throw error;

      toast.success("Auction created successfully!", { id: loadingToast });
      navigate("/dashboard/my-auctions");
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error(error.message || "Failed to create auction", {
        id: loadingToast,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const watchedCategory = watch("category");
  const watchedInitialBid = watch("initialBid");
  const watchedMaxBid = watch("maxBid");
  const watchedIsLive = watch("isLive");

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-black rounded-full">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Create Auction
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            List your item for auction and let bidders compete for the best
            price
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* User Info */}
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Seller Information
              </CardTitle>
              <CardDescription>
                Your account details for this auction
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Label
                htmlFor="username"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Enter your username"
                className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                disabled={isSubmitting || isUploading}
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Item Details
              </CardTitle>
              <CardDescription>
                Provide detailed information about your item
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Image className="h-4 w-4" />
                  Item Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  {imageUrl ? (
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(null);
                          setValue("image", null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Upload item image</p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG up to 10MB
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="max-w-xs mx-auto"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue("image", file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImageUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        disabled={isSubmitting || isUploading}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Category
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                    disabled={isSubmitting || isUploading}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-black">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                  {watchedCategory && (
                    <Badge variant="outline" className="mt-2">
                      {watchedCategory}
                    </Badge>
                  )}
                </div>

                {/* Item Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Item Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter item name"
                    className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                    disabled={isSubmitting || isUploading}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Provide a detailed description of your item..."
                  rows={4}
                  className="mt-1 border-gray-300 focus:border-black focus:ring-black resize-none"
                  disabled={isSubmitting || isUploading}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bidding Section */}
          <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bidding Configuration
              </CardTitle>
              <CardDescription>
                Set your auction parameters and timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Bid */}
                <div>
                  <Label
                    htmlFor="initialBid"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Starting Bid ($)
                  </Label>
                  <Input
                    id="initialBid"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("initialBid", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                    disabled={isSubmitting || isUploading}
                  />
                  {errors.initialBid && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.initialBid.message}
                    </p>
                  )}
                  {watchedInitialBid > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                      Starting at ${watchedInitialBid}
                    </p>
                  )}
                </div>

                {/* Max Bid */}
                <div>
                  <Label
                    htmlFor="maxBid"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Reserve Price ($)
                  </Label>
                  <Input
                    id="maxBid"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("maxBid", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                    disabled={isSubmitting || isUploading}
                  />
                  {errors.maxBid && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.maxBid.message}
                    </p>
                  )}
                  {watchedMaxBid > 0 && (
                    <p className="text-blue-600 text-sm mt-1">
                      Reserve at ${watchedMaxBid}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Live Auction Toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Live Auction
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Enable for quick live auctions with shorter durations
                    </p>
                  </div>
                  <Switch
                    checked={watchedIsLive}
                    onCheckedChange={(checked) => {
                      setValue("isLive", checked);
                      if (checked) {
                        setValue("duration", 10);
                        setValue("liveDuration", 10);
                      } else {
                        setValue("duration", 24);
                      }
                    }}
                    disabled={isSubmitting || isUploading}
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {watchedIsLive
                    ? "Live Duration (minutes)"
                    : "Auction Duration (hours)"}
                </Label>
                {watchedIsLive ? (
                  <div className="flex gap-2 mt-3">
                    {[10, 30].map((minutes) => (
                      <Button
                        key={minutes}
                        type="button"
                        variant={
                          watchedIsLive && watch("liveDuration") === minutes
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setValue("liveDuration", minutes)}
                        className="border-gray-300 hover:bg-black hover:text-white transition-colors"
                        disabled={isSubmitting || isUploading}
                      >
                        {minutes} min
                      </Button>
                    ))}
                  </div>
                ) : (
                  <>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="168"
                      {...register("duration", { valueAsNumber: true })}
                      className="mt-2 border-gray-300 focus:border-black focus:ring-black"
                      disabled={isSubmitting || isUploading}
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.duration.message}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[1, 3, 6, 12, 24, 48, 72, 168].map((hours) => (
                        <Button
                          key={hours}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue("duration", hours)}
                          className="border-gray-300 hover:bg-black hover:text-white transition-colors"
                          disabled={isSubmitting || isUploading}
                        >
                          {hours}h
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="border-2 border-black">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-lg">
                    Ready to Create Your Auction?
                  </h3>
                  <p className="text-gray-600">
                    Review and launch your auction to start receiving bids
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                    disabled={isSubmitting || isUploading}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="bg-black text-white hover:bg-gray-800 px-8 py-3 font-medium"
                  >
                    {isSubmitting || isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gavel className="h-4 w-4 mr-2" />
                        Create Auction
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
