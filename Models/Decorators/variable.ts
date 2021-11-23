import { ObjectId } from "bson";

export const objectIDArray = () => (target: any, key: string) => {
    const getter = function () {
        return target.getAttribute(key);
    }
    const setter = function (value: ObjectId[]) {
        target.setAttribute(key, value);
    }

    target.get = getter;
    target.set = setter;
}