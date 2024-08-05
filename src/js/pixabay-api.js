import axios from "axios";

export async function searchingRequest(params) {
  const response = await axios.get(`https://pixabay.com/api/?${params}`)
  return response.data
}
