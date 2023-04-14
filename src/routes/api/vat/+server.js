import { error, json } from "@sveltejs/kit";
import validateVat from "validate-vat-ts";

export async function POST({ request }) {
  const data = await request.json();

  const vatNr = data.vatNr;
  const country = data.country;

  const validationInfo = await validateVat(country, vatNr);

  if (validationInfo.valid === true) {
    return json("valid");
  } else {
    return json("invalid");
  }
}
