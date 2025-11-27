export default async function handler(req, res) {
  return res.status(200).json({
    status: "Nova Engine online",
    timestamp: Date.now()
  });
}
