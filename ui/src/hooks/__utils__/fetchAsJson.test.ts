import { setupMockFetch } from "../../__mocks__/global";
import { fetchAsJson } from "./fetchAsJson";

const defaultHeaderCall = {
   headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
   },
   method: "GET",
};

describe("fetchAsJson()", () => {
   beforeEach(() => {
      setupMockFetch({});
   });

   it("should generate urls properly when providing just params", () => {
      const justParams = [
         {
            isParam: true,
            name: "Test",
            value: "hi",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain/hi",
         defaultHeaderCall
      );
   });

   it("should generate urls properly when providing just query params", () => {
      const justParams = [
         {
            isQuery: true,
            name: "Test",
            value: "hi",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain?Test=hi",
         defaultHeaderCall
      );
   });

   it("should generate urls properly when providing mixture of both", () => {
      const justParams = [
         {
            isQuery: true,
            name: "Test",
            value: "hi",
         },
         {
            isParam: true,
            name: "Test2",
            value: "hi2",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain/hi2?Test=hi",
         defaultHeaderCall
      );
   });

   it("should generate urls properly when providing multiple params", () => {
      const justParams = [
         {
            isParam: true,
            name: "Test",
            value: "hi",
         },
         {
            isParam: true,
            name: "Test2",
            value: "hi2",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain/hi/hi2",
         defaultHeaderCall
      );
   });

   it("should generate urls properly when providing multiple query params", () => {
      const justParams = [
         {
            isQuery: true,
            name: "Test",
            value: "hi",
         },
         {
            isQuery: true,
            name: "Test2",
            value: "hi2",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain?Test=hi&Test2=hi2",
         defaultHeaderCall
      );
   });

   it("should generate paths in encoded format for paths", () => {
      const justParams = [
         {
            isQuery: true,
            name: "Test",
            value: "hi",
         },
         {
            isQuery: true,
            valueIsPath: true,
            name: "Test2",
            value: "hi2/hi3/hi4",
         },
      ];

      fetchAsJson("test-domain", justParams);

      expect(global.fetch).toHaveBeenCalledWith(
         "http://localhost:3010/test-domain?Test=hi&Test2=hi2%2Fhi3%2Fhi4",
         defaultHeaderCall
      );
   });
});
