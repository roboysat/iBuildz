import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Language, useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Eye, Calendar, MapPin, Star, Phone, Mail, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  priceUnit: z.enum(["per_project", "per_sqft", "per_hour"]),
  features: z.array(z.string()).optional(),
});

const furnitureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  materials: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

const providerSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  location: z.enum(["L.B. Nagar", "B.N. Reddy"]),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  experience: z.string().min(1, "Experience is required"),
});

export default function MerchantPortal() {
  const [language, setLanguage] = useState<Language>('en');
  const [isUserPortal, setIsUserPortal] = useState(false);
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslation(language);

  // Check authorization
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to access the merchant portal.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, toast]);

  const { data: serviceCategories } = useQuery({
    queryKey: ["/api/service-categories"],
    retry: false,
  });

  const { data: serviceProvider } = useQuery({
    queryKey: ["/api/service-providers", "me"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services", serviceProvider?.id],
    retry: false,
    enabled: !!serviceProvider?.id,
  });

  const { data: furnitureProducts } = useQuery({
    queryKey: ["/api/furniture-products", serviceProvider?.id],
    retry: false,
    enabled: !!serviceProvider?.id,
  });

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings", serviceProvider?.id],
    retry: false,
    enabled: !!serviceProvider?.id,
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: z.infer<typeof providerSchema>) => {
      const response = await apiRequest("POST", "/api/service-providers", {
        ...data,
        categoryId: parseInt(data.categoryId),
        experience: parseInt(data.experience),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service provider profile created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create service provider profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof serviceSchema>) => {
      const response = await apiRequest("POST", "/api/services", {
        ...data,
        providerId: serviceProvider?.id,
        categoryId: parseInt(data.categoryId),
        price: data.price,
        features: data.features || [],
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Service added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createFurnitureMutation = useMutation({
    mutationFn: async (data: z.infer<typeof furnitureSchema>) => {
      const response = await apiRequest("POST", "/api/furniture-products", {
        ...data,
        providerId: serviceProvider?.id,
        price: data.price,
        stockQuantity: parseInt(data.stockQuantity),
        materials: data.materials || [],
        colors: data.colors || [],
        inStock: true,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Furniture product added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/furniture-products"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add furniture product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const providerForm = useForm<z.infer<typeof providerSchema>>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      businessName: "",
      description: "",
      categoryId: "",
      location: "L.B. Nagar",
      phone: "",
      email: user?.email || "",
      experience: "",
    },
  });

  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
      priceUnit: "per_project",
      features: [],
    },
  });

  const furnitureForm = useForm<z.infer<typeof furnitureSchema>>({
    resolver: zodResolver(furnitureSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stockQuantity: "",
      materials: [],
      colors: [],
    },
  });

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handlePortalToggle = () => {
    setIsUserPortal(!isUserPortal);
    if (isUserPortal) {
      setLocation('/');
    }
  };

  const onProviderSubmit = (data: z.infer<typeof providerSchema>) => {
    createProviderMutation.mutate(data);
  };

  const onServiceSubmit = (data: z.infer<typeof serviceSchema>) => {
    createServiceMutation.mutate(data);
  };

  const onFurnitureSubmit = (data: z.infer<typeof furnitureSchema>) => {
    createFurnitureMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-green text-white"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isUserPortal={isUserPortal}
        onPortalToggle={handlePortalToggle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Merchant Portal</h1>
          <p className="text-slate-gray">Manage your services, products, and bookings</p>
        </div>

        {!serviceProvider ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create Your Service Provider Profile</CardTitle>
              <p className="text-slate-gray">Set up your business profile to start offering services on iBuildz</p>
            </CardHeader>
            <CardContent>
              <Form {...providerForm}>
                <form onSubmit={providerForm.handleSubmit(onProviderSubmit)} className="space-y-4">
                  <FormField
                    control={providerForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={providerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business and services"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={providerForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceCategories?.map((category: any) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={providerForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="L.B. Nagar">L.B. Nagar</SelectItem>
                              <SelectItem value="B.N. Reddy">B.N. Reddy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={providerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 XXXXX XXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={providerForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={providerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="business@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-green hover:bg-emerald-700"
                    disabled={createProviderMutation.isPending}
                  >
                    {createProviderMutation.isPending ? "Creating..." : "Create Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="furniture">Furniture</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{services?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Furniture Products</CardTitle>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{furnitureProducts?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {bookings?.filter((b: any) => b.status === 'confirmed' || b.status === 'pending').length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{serviceProvider.businessName}</h3>
                      <p className="text-slate-gray">{serviceProvider.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-emerald-green" />
                        <span className="text-sm">{serviceProvider.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-emerald-green" />
                        <span className="text-sm">{serviceProvider.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-emerald-green" />
                        <span className="text-sm">{serviceProvider.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-emerald-green" />
                        <span className="text-sm">
                          {serviceProvider.rating} ({serviceProvider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-green hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Service</DialogTitle>
                    </DialogHeader>
                    <Form {...serviceForm}>
                      <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4">
                        <FormField
                          control={serviceForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Modern Kitchen Design" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={serviceForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your service offering"
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={serviceForm.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {serviceCategories?.map((category: any) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={serviceForm.control}
                            name="priceUnit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pricing Unit</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select pricing unit" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="per_project">Per Project</SelectItem>
                                    <SelectItem value="per_sqft">Per Sq Ft</SelectItem>
                                    <SelectItem value="per_hour">Per Hour</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={serviceForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 25000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-emerald-green hover:bg-emerald-700"
                          disabled={createServiceMutation.isPending}
                        >
                          {createServiceMutation.isPending ? "Adding..." : "Add Service"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services?.map((service: any) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <p className="text-slate-gray text-sm line-clamp-2">{service.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-gray">Price</p>
                          <p className="text-xl font-bold text-emerald-green">₹{service.price}</p>
                          <p className="text-xs text-slate-gray">{service.priceUnit.replace('_', ' ')}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!services?.length && (
                <div className="text-center py-12">
                  <p className="text-slate-gray text-lg">No services added yet.</p>
                  <p className="text-slate-gray text-sm">Add your first service to start receiving bookings.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="furniture" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Furniture</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-green hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Furniture Product</DialogTitle>
                    </DialogHeader>
                    <Form {...furnitureForm}>
                      <form onSubmit={furnitureForm.handleSubmit(onFurnitureSubmit)} className="space-y-4">
                        <FormField
                          control={furnitureForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Modern Sofa Set" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={furnitureForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the furniture product"
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={furnitureForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sofa">Sofa</SelectItem>
                                    <SelectItem value="table">Table</SelectItem>
                                    <SelectItem value="chair">Chair</SelectItem>
                                    <SelectItem value="wardrobe">Wardrobe</SelectItem>
                                    <SelectItem value="bed">Bed</SelectItem>
                                    <SelectItem value="cabinet">Cabinet</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={furnitureForm.control}
                            name="stockQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={furnitureForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 15000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-emerald-green hover:bg-emerald-700"
                          disabled={createFurnitureMutation.isPending}
                        >
                          {createFurnitureMutation.isPending ? "Adding..." : "Add Product"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {furnitureProducts?.map((product: any) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-slate-gray text-sm line-clamp-2">{product.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge className={product.inStock ? "bg-emerald-green text-white" : "bg-red-500 text-white"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-emerald-green">₹{product.price}</p>
                          <p className="text-xs text-slate-gray">Stock: {product.stockQuantity}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!furnitureProducts?.length && (
                <div className="text-center py-12">
                  <p className="text-slate-gray text-lg">No furniture products added yet.</p>
                  <p className="text-slate-gray text-sm">Add your first product to start selling.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Bookings</h2>
              
              <div className="space-y-4">
                {bookings?.map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Booking #{booking.id}
                          </h3>
                          <p className="text-slate-gray text-sm">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Customer Details</p>
                          <p className="text-slate-gray">{booking.customerName}</p>
                          <p className="text-slate-gray">{booking.customerPhone}</p>
                          {booking.customerEmail && (
                            <p className="text-slate-gray">{booking.customerEmail}</p>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Project Details</p>
                          <p className="text-slate-gray">Location: {booking.location}</p>
                          {booking.estimatedCost && (
                            <p className="text-emerald-green font-semibold">
                              Estimated Cost: ₹{booking.estimatedCost}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Notes</p>
                          <p className="text-slate-gray">{booking.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="bg-emerald-green hover:bg-emerald-700">
                          Update Status
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Customer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!bookings?.length && (
                <div className="text-center py-12">
                  <p className="text-slate-gray text-lg">No bookings yet.</p>
                  <p className="text-slate-gray text-sm">Bookings will appear here when customers book your services.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
