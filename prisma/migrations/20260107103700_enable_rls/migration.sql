-- Enable RLS
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ArticleToTag" ENABLE ROW LEVEL SECURITY;

-- Policies for Tag
CREATE POLICY "Public tags are viewable by everyone" ON "Tag" FOR SELECT USING (true);
CREATE POLICY "Users can insert tags" ON "Tag" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update tags" ON "Tag" FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Category
CREATE POLICY "Public categories are viewable by everyone" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Users can insert categories" ON "Category" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update categories" ON "Category" FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Comment
CREATE POLICY "Public comments are viewable by everyone" ON "Comment" FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON "Comment" FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for _ArticleToTag
CREATE POLICY "Public article tags are viewable by everyone" ON "_ArticleToTag" FOR SELECT USING (true);
CREATE POLICY "Users can manage article tags" ON "_ArticleToTag" FOR ALL USING (auth.role() = 'authenticated');
