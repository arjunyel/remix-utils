import { json as remixJson, redirect } from "@remix-run/server-runtime";
import { JsonValue } from "type-fest";

/**
 * A wrapper of the `json` function from `remix` which accepts a generic for the
 * data to be serialized. This allows you to use the same type for `json` and
 * on `useLoaderData` to ensure the type is always in sync.
 *
 * The type must extend the JsonValue from type-fest, this means only JSON
 * compatible types are allowed inside the data which will help you avoid trying
 * to send functions or class instances.
 * @example
 * type LoaderData = { user: { name: string } };
 * let action: ActionFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   return json<LoaderData>({ user });
 * }
 * function View() {
 *   let { user } = useLoaderData<LoaderData>();
 *   return <UserProfile user={user} />;
 * }
 */
export function json<Data extends JsonValue>(
  data: Data,
  init?: number | ResponseInit
) {
  return remixJson(data, init);
}

/**
 * Create a new Response with a redirect set to the URL the user was before.
 * It uses the Referer header to detect the previous URL. It asks for a fallback
 * URL in case the Referer couldn't be found, this fallback should be a URL you
 * may be ok the user to land to after an action even if it's not the same.
 * @example
 * let action: ActionFunction = async ({ request }) => {
 *   await doSomething(request);
 *   // If the user was on `/search?query=something` we redirect to that URL
 *   // but if we couldn't we redirect to `/search`, which is an good enough
 *   // fallback
 *   return redirectBack(request, { fallback: "/search" });
 * }
 */
export function redirectBack(
  request: Request,
  { fallback, ...init }: ResponseInit & { fallback: string }
): Response {
  return redirect(request.headers.get("Referer") ?? fallback, init);
}

/**
 * Create a response receiving a JSON object with the status code 400.
 * @example
 * let loader: LoaderFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   throw badRequest<BoundaryData>({ user });
 * }
 */
export function badRequest<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 400 });
}

/**
 * Create a response receiving a JSON object with the status code 401.
 * @example
 * let loader: LoaderFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   throw unauthorized<BoundaryData>({ user });
 * }
 */
export function unauthorized<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 401 });
}

/**
 * Create a response receiving a JSON object with the status code 403.
 * @example
 * let loader: LoaderFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   if (!user.idAdmin) throw forbidden<BoundaryData>({ user });
 * }
 */
export function forbidden<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 403 });
}

/**
 * Create a response receiving a JSON object with the status code 404.
 * @example
 * let loader: LoaderFunction = async ({ request, params }) => {
 *   let user = await getUser(request);
 *   if (!db.exists(params.id)) throw notFound<BoundaryData>({ user });
 * }
 */
export function notFound<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 404 });
}

/**
 * Create a response receiving a JSON object with the status code 422.
 * @example
 * let loader: LoaderFunction = async ({ request, params }) => {
 *   let user = await getUser(request);
 *   throw unprocessableEntity<BoundaryData>({ user });
 * }
 */
export function unprocessableEntity<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 422 });
}

/**
 * Create a response receiving a JSON object with the status code 500.
 * @example
 * let loader: LoaderFunction = async ({ request }) => {
 *   let user = await getUser(request);
 *   throw serverError<BoundaryData>({ user });
 * }
 */
export function serverError<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">
) {
  return json<Data>(data, { ...init, status: 500 });
}

/**
 * Create a response with only the status 304 and optional headers.
 * This is useful when trying to implement conditional responses based on Etags.
 * @example
 * let loader: LoaderFunction = async ({ request }) => {
 *   return notModified();
 * }
 */
export function notModified(init?: Omit<ResponseInit, "status">) {
  return new Response("", { ...init, status: 304 });
}