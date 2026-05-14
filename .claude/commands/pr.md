# /pr

GitHub Pull Request を作成・更新します。

## 手順

1. `gh pr list --head <current-branch>` で既存 PR を確認する
2. **PR が存在する場合**: `gh pr edit <number> --title "..." --body "..."` で更新する
3. **PR が存在しない場合**: `gh pr create` で新規作成する

## PR テンプレート

```
## 概要
<!-- この PR で何を変更したか -->

## 変更内容
- 

## 動作確認
- [ ] Docker 環境で起動確認
- [ ] 追加した機能の動作確認
- [ ] 既存機能へのデグレがないことを確認

## 関連
<!-- Issue や Notion リンクなど -->
```

## 注意
- base ブランチは `main`
- draft にする場合は `--draft` フラグを付ける
