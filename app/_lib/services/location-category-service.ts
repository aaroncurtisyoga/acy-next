import prisma from "@/app/_lib/prisma";

interface LocationData {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
}

export class LocationCategoryService {
  private locationCache: Map<string, string> = new Map();
  private categoryCache: Map<string, string> = new Map();

  async getLocationId(locationData: LocationData): Promise<string> {
    const cacheKey = locationData.name;

    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey)!;
    }

    let location = await prisma.location.findFirst({
      where: { name: cacheKey },
    });

    if (!location) {
      location = await prisma.location.create({
        data: locationData,
      });
    }

    this.locationCache.set(cacheKey, location.id);
    return location.id;
  }

  async getCategoryId(categoryName: string): Promise<string> {
    const cacheKey = categoryName;

    if (this.categoryCache.has(cacheKey)) {
      return this.categoryCache.get(cacheKey)!;
    }

    let category = await prisma.category.findFirst({
      where: { name: cacheKey },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: cacheKey },
      });
    }

    this.categoryCache.set(cacheKey, category.id);
    return category.id;
  }

  // Predefined locations for convenience
  async getBrightBearLocationId(): Promise<string> {
    return this.getLocationId({
      name: "Bright Bear Yoga DC",
      formattedAddress: "1000 Florida Ave NE, Washington, DC 20002",
      lat: 38.9172,
      lng: -76.9834,
    });
  }

  async getDCBPLocationId(): Promise<string> {
    return this.getLocationId({
      name: "DC Bouldering Project",
      formattedAddress: "1432 33rd St, Washington, DC 20018",
      lat: 38.9397,
      lng: -76.9949,
    });
  }

  async getDefaultCategoryId(): Promise<string> {
    return this.getCategoryId("Yoga Class");
  }
}
