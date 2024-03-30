import { http, HttpResponse } from "msw";
import terminalsData from "./terminal.json";
import other from "./other.json";
import hataListesi from "./HataListesi.json"
import { TerminalLoginForm } from "../Forms";

export const handlers = [
  http.get("https://api.sunucu.com/terminals", () => {
    return HttpResponse.json(terminalsData);
  }),
  http.get("https://api.sunucu.com/terminal/*", () => {
    return HttpResponse.json(other["first-screen"].data);
  }),
  http.post("https://api.sunucu.com/login/", async ({ request }) => {
    const requestBody = (await request.json()) as TerminalLoginForm;
    if (requestBody.sicilNo == 99619 && requestBody.password == "1234")
      return HttpResponse.json(request, {
        status: 200,
      });
    return new HttpResponse("Not found", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }),
  http.get("https://api.sunucu.com/defect/header/:id", ({ params }) => {
    const { id } = params;
    if (parseInt(String(id)) == 123) {
      return HttpResponse.json(other["anotherDefectPage"]["defect-header"]);
    } else {
      return HttpResponse.json(other["exampleDefectPage"]["defect-header"]);
    }
  }),
  http.get("https://api.sunucu.com/defect/screen/:id", ({ params }) => {
    const { id } = params;
    if (parseInt(String(id)) == 123) {
      return HttpResponse.json(other["anotherDefectPage"]["defect-screen"]);
    } else {
      return HttpResponse.json(other["exampleDefectPage"]["defect-screen"]);
    }
  }),
  http.get("https://api.sunucu.com/defects/:filterCode", ({ params }) => {
    const { filterCode } = params;
    return HttpResponse.json((hataListesi as any)["data"][0]["defectList"])
  }),
];
