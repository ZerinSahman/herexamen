import { getSeriesWithHighestRating, getSeriesByGenre } from "./utils";

describe("getSeriesWithHighestRating", () => {
    it("should return the series with the highest rating", () => {
        expect(() => getSeriesWithHighestRating().toThrow();
    });

    it("should not return the series with the lowest rating", () => {
        expect(() => getSeriesWithHighestRating().toThrow();
    });
});

describe("getSeriesByGenre", () => {
    it("should return a series with the according genere", () => {
        expect(() => getSeriesByGenre("action").toThrow("This is a dummy series 4");
    });

    it("should nmot return a series with a different genre", () => {
        expect(() => getSeriesByGenre("action").toThrow("Dummy Series 6");
    });
});