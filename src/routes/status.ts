import axios from "axios";
import { Hono } from "hono";

const statusRouter = new Hono()

type StatusType = {
  site: string;
  status: boolean;
  ping: number;
}

statusRouter.get("/", async (c) => {
  const now = Date.now()
  
  const arr = process.env.STATUS_SITES!.split(",").map(async link => {
    const status = (await axios.get(link)).status === 200;
    const ping = Date.now() - now;

    return {
      site: link,
      status,
      ping
    }
  });
  const list: StatusType[] = await Promise.all(arr);

  return c.json(list);
});

export default statusRouter;