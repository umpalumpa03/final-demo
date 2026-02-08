import { TestBed } from "@angular/core/testing";
import { NoConnectionService } from "./no-connection.service";

describe('NoConnectionService', () => {
    let service: NoConnectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NoConnectionService],
        });
        service = TestBed.inject(NoConnectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return online status', () => {
        expect(service.isOnline()).toBe(navigator.onLine);
    });

    it('should call onOnline when online event is triggered', () => {
        const spy = vi.spyOn(service, 'onOnline');
        window.dispatchEvent(new Event('online'));
        expect(spy).toHaveBeenCalled();
    });

    it('should call onOffline when offline event is triggered', () => {
        const spy = vi.spyOn(service, 'onOffline');
        window.dispatchEvent(new Event('offline'));
        expect(spy).toHaveBeenCalled();
    });

});