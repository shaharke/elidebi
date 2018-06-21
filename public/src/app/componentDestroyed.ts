import { Subject } from "rxjs";
import { Observable } from "rxjs";

export type OnDestroyLike = {
    ngOnDestroy(): void;
}

export function componentDestroyed(component: OnDestroyLike): Observable<any> {
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new Subject();
    component.ngOnDestroy = function () {
        oldNgOnDestroy && oldNgOnDestroy.apply(component);
        stop$.next(undefined);
        stop$.complete();
    };
    return stop$;
}
