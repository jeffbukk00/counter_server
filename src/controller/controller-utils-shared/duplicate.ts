import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";

import sharedConstants from "@/constants/shared";

export const insertMotivationTexts = async (motivationTexts: any) => {
  const insertedMotivationTexts = await MotivationText.insertMany(
    motivationTexts.map((e: any) => {
      return { text: e.text };
    })
  );
  const motivationTextIds = [...insertedMotivationTexts].map((e) => e._id);

  return motivationTextIds;
};

export const insertMotivationLinks = async (motivationLinks: any) => {
  const insertedMotivationLinks = await MotivationLink.insertMany(
    motivationLinks.map((e: any) => {
      return { title: e.title, link: e.link };
    })
  );
  const motivationLinkIds = [...insertedMotivationLinks].map((e) => e._id);

  return motivationLinkIds;
};

export const duplicateCounterUtil = async (
  counter: any,
  duplicateType: string = sharedConstants.duplicateType.all
) => {
  const newCounter = new Counter({
    title: counter.title,
    startCount: counter.startCount,
    currentCount: counter.startCount,
    endCount: counter.endCount,
    direction: counter.direction,
    achievementStack: 0,
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  newCounter.motivationTextIds = await insertMotivationTexts([
    ...counter.motivationTexts,
  ]);

  if (duplicateType === sharedConstants.duplicateType.all) {
    newCounter.motivationLinkIds = await insertMotivationLinks([
      ...counter.motivationLinks,
    ]);
  }

  await newCounter.save();

  return newCounter._id;
};

export const duplicateBucketUtil = async (
  bucket: any,
  counters: any,
  duplicateType: string = sharedConstants.duplicateType.all
) => {
  const newBucket = new Bucket({
    title: bucket.title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });
  newBucket.motivationTextIds = await insertMotivationTexts([
    ...bucket.motivationTexts,
  ]);
  if (duplicateType === sharedConstants.duplicateType.all) {
    newBucket.motivationLinkIds = await insertMotivationLinks([
      ...bucket.motivationLinks,
    ]);
  }
  for (const e of counters) {
    const duplicatedCounterId = await duplicateCounterUtil(e, duplicateType);
    newBucket.counterIds.push(duplicatedCounterId);
  }
  await newBucket.save();
  return newBucket._id;
};
