#!/bin/bash
# Copy check over shipped sources: em dashes, banned words, non-US spelling/currency, 24-hour times.
cd /workspace/tripup
FILES=$(rg --files prototype/src storybook/src storybook/.storybook design-system deck-src site/index.html site/deck site/case-study prototype/*.md storybook/*.md research-review.md 2>/dev/null | rg -v "CHANGELOG|\.png$|\.jpg$|\.woff2?$|\.bak|shots/" )
echo "== em dashes";        rg -n "—" $FILES | wc -l
echo "== banned words";     rg -n -i "\bseamless|\belevate|\bunlock|\bdelve|effortless|curated journey|game-changer" $FILES | wc -l
echo "== not X but Y";      rg -n -i "\bnot just\b|it's not just|isn't just" $FILES | wc -l
echo "== euro/EUR";         rg -n "€|\bEUR\b|en-IE|en-GB" $FILES | wc -l
echo "== UK spelling";      rg -n -i "colour|behaviour|centre|favourite|organis|cancell|\bgrey|traveller" $FILES | wc -l
echo "== 24h times";        rg -n "\b(1[3-9]|2[0-3]):[0-5][0-9]\b" $FILES | rg -v "viewBox|[0-9]{2}:[0-9]{2}:[0-9]{2}\.|rgba|sha|integrity" | wc -l
