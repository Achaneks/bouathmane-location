import { render, screen } from "@testing-library/react";
import { CarStatusBadge } from "@/components/site/car-status-badge";
import { CarStatus } from "@/generated/prisma/enums";

describe("CarStatusBadge", () => {
  it("shows a green badge with 'Available' text for AVAILABLE status", () => {
    render(<CarStatusBadge status={CarStatus.AVAILABLE} />);

    const badge = screen.getByText("Available");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-available");
  });

  it("shows a red badge with 'Rented' text for RENTED status", () => {
    render(<CarStatusBadge status={CarStatus.RENTED} />);

    const badge = screen.getByText("Rented");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-unavailable");
  });

  it("shows a gray badge with 'Maintenance' text for MAINTENANCE status", () => {
    render(<CarStatusBadge status={CarStatus.MAINTENANCE} />);

    const badge = screen.getByText("Maintenance");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-text-secondary");
  });
});
