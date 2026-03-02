import { z } from "zod";
import {BooleanResponseSchema, ClientResponseSchema, ResponseErrorSchema} from "./index";

export type ResponseError = z.infer<typeof ResponseErrorSchema>;

export type ClientResponse<T> = z.infer<
    ReturnType<typeof ClientResponseSchema<T>>
>;

export type BooleanResponse = z.infer<typeof BooleanResponseSchema>;