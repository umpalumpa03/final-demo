import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { HttpClient } from "@angular/common/http";
import * as ngCore from "@angular/core";
import { of } from "rxjs";
import { PersonalInfoApiService } from "./personal-info.api.service";
import { environment } from "../../../../environments/environment";
import { PersonalInfoDto } from "../../../store/personal-info/personal-info.state";

describe("PersonalInfoApiService (vitest)", () => {
  let service: PersonalInfoApiService;
  let httpMock: Pick<HttpClient, "get" | "put">;
  const baseUrl = `${environment.apiUrl}/settings/personal-info`;

  beforeEach(() => {
    httpMock = {
      get: vi.fn(),
      put: vi.fn(),
    } as unknown as HttpClient;

    vi.spyOn(ngCore, "inject").mockReturnValue(httpMock as never);

    service = new PersonalInfoApiService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call GET personal info", () => {
    const mockResponse: PersonalInfoDto = {
      pId: "12345678901",
      phone: "555999333",
    };

    (httpMock.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      of(mockResponse)
    );

    service.getPersonalInfo().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(httpMock.get).toHaveBeenCalledWith(baseUrl);
  });

  it("should call PUT personal info with payload", () => {
    const payload: PersonalInfoDto = {
      pId: "12345678901",
      phone: "555999333",
    };
    const mockResponse: PersonalInfoDto = payload;

    (httpMock.put as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      of(mockResponse)
    );

    service.updatePersonalInfo(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(httpMock.put).toHaveBeenCalledWith(baseUrl, payload);
  });
});

