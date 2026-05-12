import { navigationRef } from "../src/utils/navigation";

export default {
    navigate(name: string, params?: Record<string, any>) {
        if (navigationRef.isReady()) {
            //@ts-ignore
            navigationRef.navigate(name, params);
        }
    }
}