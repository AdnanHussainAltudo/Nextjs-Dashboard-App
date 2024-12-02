import { Button } from "@/app/ui/button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Button Component", () => {
  test("renders button with children text", () => {
    render(<Button>Click Me</Button>);

    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("applies default styles", () => {
    render(<Button>Styled Button</Button>);

    const buttonElement = screen.getByText(/Styled Button/i);
    expect(buttonElement).toHaveClass(
      "flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
    );
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const buttonElement = screen.getByText(/Custom Button/i);
    expect(buttonElement).toHaveClass("custom-class");
  });

  test("handles click event", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const buttonElement = screen.getByText(/Click Me/i);
    await userEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("handles disabled state", () => {
    render(<Button disabled>Disabled Button</Button>);

    const buttonElement = screen.getByText(/Disabled Button/i);
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass("aria-disabled:cursor-not-allowed");
  });
});
