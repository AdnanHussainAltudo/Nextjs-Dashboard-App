import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
} from "@/app/lib/utils";
import { Revenue } from "@/app/lib/definitions";

describe("Utils", () => {
  describe("formatCurrency", () => {
    it("should format numbers to USD currency correctly", () => {
      expect(formatCurrency(12345)).toBe("$123.45");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(100000)).toBe("$1,000.00");
    });

    it("should format numbers to Indian Rupees correctly", () => {
      const formatINR = (amount: number) =>
        (amount / 100).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        });

      expect(formatINR(12345)).toBe("₹123.45");
      expect(formatINR(0)).toBe("₹0.00");
      expect(formatINR(100000)).toBe("₹1,000.00");
    });
  });

  describe("formatDateToLocal", () => {
    it("should format a date string to a short localized format for en-US", () => {
      const result = formatDateToLocal("2024-01-01");
      expect(result).toBe("Jan 1, 2024");
    });

    it("should format a date string to a short localized format for en-IN", () => {
      const result = formatDateToLocal("2024-01-01", "en-IN");
      expect(result).toBe("1 Jan 2024");
    });
  });

  describe("generateYAxis", () => {
    it("should generate y-axis labels correctly", () => {
      const revenue: Revenue[] = [
        { month: "January", revenue: 3500 },
        { month: "February", revenue: 8000 },
      ];

      const result = generateYAxis(revenue);
      expect(result.yAxisLabels).toEqual([
        "$8K",
        "$7K",
        "$6K",
        "$5K",
        "$4K",
        "$3K",
        "$2K",
        "$1K",
        "$0K",
      ]);
      expect(result.topLabel).toBe(8000);
    });
  });

  describe("generatePagination", () => {
    it("should generate correct pagination for fewer than 7 pages", () => {
      const result = generatePagination(1, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should generate correct pagination for first few pages", () => {
      const result = generatePagination(2, 10);
      expect(result).toEqual([1, 2, 3, "...", 9, 10]);
    });

    it("should generate correct pagination for last few pages", () => {
      const result = generatePagination(9, 10);
      expect(result).toEqual([1, 2, "...", 8, 9, 10]);
    });

    it("should generate correct pagination for middle pages", () => {
      const result = generatePagination(5, 10);
      expect(result).toEqual([1, "...", 4, 5, 6, "...", 10]);
    });

    it("should handle edge cases for 7 pages exactly", () => {
      const result = generatePagination(4, 7);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("should handle invalid inputs gracefully", () => {
      expect(generatePagination(1, 0)).toEqual([]);
      expect(generatePagination(0, 5)).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
