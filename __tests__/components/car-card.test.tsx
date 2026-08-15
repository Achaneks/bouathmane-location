import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { CarCard, type CarCardData } from "@/components/site/car-card";
import { CarStatus } from "@/generated/prisma/enums";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ComponentProps<"img">) => <img {...props} alt={props.alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const car: CarCardData = {
  id: "car_1",
  make: "Mercedes-Benz",
  model: "S-Class",
  year: 2024,
  pricePerDay: 2500,
  images: ["https://example.com/car.jpg"],
  status: CarStatus.AVAILABLE,
};

describe("CarCard", () => {
  it("renders the car name", () => {
    render(<CarCard car={car} />);
    expect(screen.getByText(/Mercedes-Benz S-Class/)).toBeInTheDocument();
  });

  it("renders the formatted price", () => {
    render(<CarCard car={car} />);
    expect(screen.getByText("MAD 2,500")).toBeInTheDocument();
  });

  it("renders a WhatsApp link containing wa.me", () => {
    render(<CarCard car={car} />);
    const link = screen.getByRole("link", { name: /contact on whatsapp/i });
    expect(link.getAttribute("href")).toContain("wa.me");
  });

  it("encodes the car name in the WhatsApp href", () => {
    render(<CarCard car={car} />);
    const link = screen.getByRole("link", { name: /contact on whatsapp/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain(encodeURIComponent("Mercedes-Benz S-Class"));
  });

  it("disables the WhatsApp CTA when the car is not AVAILABLE", () => {
    render(<CarCard car={{ ...car, status: CarStatus.MAINTENANCE }} />);
    expect(screen.queryByRole("link", { name: /contact on whatsapp/i })).not.toBeInTheDocument();
    expect(screen.getByText(/contact on whatsapp/i)).toHaveAttribute("aria-disabled", "true");
  });
});
