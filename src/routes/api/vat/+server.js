import { error, json } from "@sveltejs/kit";
import validateVat from "validate-vat-ts";

export async function POST({ request }) {
  const data = await request.json();

  const validationInfo = await validateVat(
    data.client.country,
    data.client.vat.nr
  );

  console.log(validationInfo);

  data.client.vat.valid = validationInfo.valid === true ? true : false;

  if ((validationInfo.valid = false)) {
    data.error = "Failed to validate vat nr, please try again";
  }

  return json(data);
}
