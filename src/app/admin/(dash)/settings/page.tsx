import { prisma } from "@/lib/prisma";
import { imageSelect } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, Field, Fieldset, TextArea } from "@/components/admin/form";
import { ImageField } from "@/components/admin/ImageField";
import { StatsEditor } from "@/components/admin/StatsEditor";
import { changePassword, saveSettings } from "@/app/admin/actions";

export default async function AdminSettings() {
  const s = await getSettings();
  const ids = [s.heroImageId, s.profileImageId, s.quoteImageId].filter(Boolean) as string[];
  const imgs = await prisma.image.findMany({ where: { id: { in: ids } }, select: { id: true, ...imageSelect } });
  const img = (id: string | null) => imgs.find((i) => i.id === id) ?? null;

  return (
    <>
      <AdminHeader title="Site & About" />
      <ActionForm action={saveSettings} submitLabel="Save settings">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <Fieldset title="Site">
              <Field label="Website name" name="siteName" required defaultValue={s.siteName} />
              <Field label="Tagline" name="tagline" defaultValue={s.tagline} />
              <TextArea label="Default meta description (SEO)" name="seoDescription" rows={3} defaultValue={s.seoDescription} maxLength={300} />
            </Fieldset>
            <Fieldset title="Homepage">
              <ImageField name="heroImageId" label="Hero photograph" initial={img(s.heroImageId)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Hero eyebrow" name="heroEyebrow" defaultValue={s.heroEyebrow} />
                <Field label="Hero headline (script)" name="heroTitle" defaultValue={s.heroTitle} />
              </div>
              <TextArea label="Hero text" name="heroText" rows={4} defaultValue={s.heroText} hint="Each line becomes its own line." />
              <Field label="Handwritten note on the photo" name="heroAside" defaultValue={s.heroAside} hint="Separate lines with commas — e.g. Good Views, Brighter Days" />
              <TextArea label="Introduction (About section on the homepage)" name="intro" rows={3} defaultValue={s.intro} hint="Each line becomes its own paragraph." />
              <Field label="Quote band text" name="quote" defaultValue={s.quote} />
              <ImageField name="quoteImageId" label="Quote band background" initial={img(s.quoteImageId)} />
            </Fieldset>
            <Fieldset title="Social & contact">
              <Field label="Instagram username" name="instagramUsername" defaultValue={s.instagramUsername} placeholder="lifeinpeaks" hint="Used for the ‘Follow the Journey’ section and links." />
              <Field label="Facebook URL" name="facebookUrl" type="url" defaultValue={s.facebookUrl} />
              <Field label="YouTube URL" name="youtubeUrl" type="url" defaultValue={s.youtubeUrl} />
              <Field label="X (Twitter) URL" name="twitterUrl" type="url" defaultValue={s.twitterUrl} />
              <Field label="Pinterest URL" name="pinterestUrl" type="url" defaultValue={s.pinterestUrl} />
              <Field label="Public contact email" name="contactEmail" type="email" defaultValue={s.contactEmail} />
            </Fieldset>
          </div>
          <Fieldset title="About me">
            <Field label="Your name" name="ownerName" defaultValue={s.ownerName} />
            <ImageField name="profileImageId" label="Profile photograph" initial={img(s.profileImageId)} />
            <Field label="Heading" name="aboutHeading" defaultValue={s.aboutHeading} />
            <TextArea label="Short introduction" name="aboutIntro" rows={3} defaultValue={s.aboutIntro} />
            <TextArea label="Biography (Markdown)" name="aboutBio" rows={14} defaultValue={s.aboutBio} />
            <StatsEditor name="stats" initial={s.stats} />
          </Fieldset>
        </div>
      </ActionForm>

      <section className="mt-12 max-w-md">
        <h2 className="mb-4 font-display text-3xl">Change password</h2>
        <ActionForm action={changePassword} submitLabel="Change password">
          <Field label="Current password" name="currentPassword" type="password" required autoComplete="current-password" />
          <Field label="New password" name="newPassword" type="password" required minLength={10} autoComplete="new-password" />
          <Field label="Confirm new password" name="confirmPassword" type="password" required autoComplete="new-password" />
        </ActionForm>
      </section>
    </>
  );
}
