import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { PersonalInfoApiService } from "./personal-info.api.service";
import { environment } from "../../../../environments/environment";
import { PersonalInfoDto } from "../../../store/personal-info/personal-info.state";

describe("PersonalInfoApiService (vitest)", () => {
  let service: PersonalInfoApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/settings/personal-info`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersonalInfoApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PersonalInfoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call GET personal info", () => {
    const mockResponse: PersonalInfoDto = {
      pId: "12345678901",
      phone: "555999333",
    };

    service.getPersonalInfo().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should call PUT personal info with payload", () => {
    const payload: PersonalInfoDto = {
      pId: "12345678901",
      phone: "555999333",
    };
    const mockResponse = { message: "pId updated" };

    service.updatePersonalInfo({ pId: payload.pId }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({ pId: payload.pId });
    req.flush(mockResponse);
  });

  it("should call POST initiatePhoneUpdate with phone", () => {
    const phone = "555123456";
    const mockResponse = {
      challengeId: "challenge-123",
      method: "SMS",
    };

    service.initiatePhoneUpdate(phone).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/update-phone`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ phone });
    req.flush(mockResponse);
  });

  it("should call POST verifyPhoneUpdate with challengeId and code", () => {
    const challengeId = "challenge-123";
    const code = "123456";
    const mockResponse = { message: "Phone number updated successfully" };

    service.verifyPhoneUpdate(challengeId, code).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/verify-new-phone-otp`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ challengeId, code });
    req.flush(mockResponse);
  });


});

