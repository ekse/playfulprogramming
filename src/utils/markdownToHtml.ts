import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from 'remark-rehype';
import rehypeStringify from "rehype-stringify";
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkGfm from 'remark-gfm'
import path from "path";
import {postsDirectory} from "../api";
import rehypeImageSize from 'rehype-img-size';
import remarkEmbedder, {RemarkEmbedderOptions} from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'
import * as TwitchTransformer from 'gatsby-remark-embedder/dist/transformers/Twitch';
import rehypeSlug from 'rehype-slug'
import {parent} from "../api/get-site-config";
import {rehypeHeaderText} from "../api/plugins/add-header-text";
import remarkShikiTwoslash from 'remark-shiki-twoslash'
import remarkTwoslash from "remark-shiki-twoslash";

// Optional now. Probably should move to an array that's passed or something
// TODO: Create types
const behead = require('remark-behead')

export default async function markdownToHtml(slug: string, markdown: string) {
  const imageDir = path.resolve(postsDirectory, slug);
  const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Remove complaining about "div cannot be in p element"
      .use(remarkUnwrapImages)
      /* start remark plugins here */
      .use(behead, { after: 0, depth: 1 })
      .use((remarkEmbedder as any), {
          transformers: [
              oembedTransformer,
              [TwitchTransformer, {parent}]
          ]
      } as RemarkEmbedderOptions)
      /* end remark plugins here */
      .use(remarkStringify)
      .use(remarkTwoslash as any)
      .use(remarkToRehype, {allowDangerousHtml: true})
      /* start rehype plugins here */
      // TODO: https://github.com/ksoichiro/rehype-img-size/issues/4
      .use(rehypeImageSize, {
        dir: imageDir,
      })
      .use(rehypeSlug)
      .use(rehypeHeaderText)
      /* end rehype plugins here */
      .use(rehypeStringify, {allowDangerousHtml: true})
      // .use(() => tree => {
      //     debugger;
      //     return tree;
      // })
      .process(markdown);

  return result.toString()
}
