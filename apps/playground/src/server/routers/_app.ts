// Copyright (C) 2023 Light, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { protectedProcedure, publicProcedure, router } from "../trpc";

let latestPost = {
  id: 0,
  title: "latest post",
  content: "hello world",
  createdAt: new Date(),
};

export const createPost = publicProcedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  )
  .mutation(async opts => {
    latestPost = {
      id: latestPost.id + 1,
      createdAt: new Date(),
      ...opts.input,
    };

    return latestPost;
  });

export const appRouter = router({
  foo: router({
    bar: publicProcedure.query(
      () => `bar - ${new Date().toISOString().split("T")[1]}`,
    ),
    baz: publicProcedure.query(
      () => `baz - ${new Date().toISOString().split("T")[1]}`,
    ),
  }),
  greeting: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async opts => {
      // eslint-disable-next-line no-console
      console.log("request from", opts.ctx.headers?.["x-trpc-source"]);
      return `hello ${opts.input.text} - ${Math.random()}`;
    }),

  secret: publicProcedure.query(async opts => {
    if (!opts.ctx.session) {
      return "You are not authenticated";
    }
    return "Cool, you're authenticated!";
  }),

  me: publicProcedure.query(opts => {
    return opts.ctx.session;
  }),

  createPost,

  getLatestPost: publicProcedure.query(async () => {
    return latestPost;
  }),
});

export type AppRouter = typeof appRouter;
