import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { inject } from "@angular/core";
import { EMPTY, exhaustMap, Observable, pipe, tap } from "rxjs";

import { AppearanceState, ResponceTheme } from "../models/appearance.model";
import { AppearanceService } from "../services/appearance-api.service";
import { themesConfig } from "../config/appearance.config";

export const initialState: AppearanceState = {
  themes: [],
  isLoading: false,
  isRefreshing: false,
  hasError: false,
  hasLoaded: false,
}

export const AppearanceStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {
        const appearanceService = inject(AppearanceService);
        
        return {
            fetchThemes: rxMethod<{force?: boolean}>(
                pipe(
                    tap(({ force }) => {
                        if(force) {
                            patchState(store, { isRefreshing: true, hasError: false });
                        } else {
                            patchState(store, { isLoading: true, hasError: false });
                        }
                    }),
                    exhaustMap(({ force }) => {
                        if(!force && store.hasLoaded()) {
                            return EMPTY;
                        }

                        return appearanceService.getAvailableThemes().pipe(
                            tap({
                                next: (res: ResponceTheme[]) => {
                                    const mappedThemes = res.map(theme => {
                                        const config = themesConfig.find(c => c.value === theme.value);
                                        return {
                                            ...theme,
                                            subtitle: config?.subtitle!,
                                        }
                                    })

                                    patchState(store, {
                                        themes: mappedThemes,
                                        isLoading: false,
                                        isRefreshing: false,
                                        hasLoaded: true,
                                    })
                                },
                                error: () => {
                                    patchState(store, {
                                        isLoading: false,
                                        isRefreshing: false,
                                        hasError: true,
                                    })
                                },
                            }),
                        )

                        
                    })

                )
            ),

            updateTheme(theme: string): Observable<void> {
                patchState(store, { isLoading: true, hasError: false });

                // return appearanceService.updateUserTheme
            }
            
            
        }
    })
)