export function normalizeIssueRef(value, defaultRepository) {
 const ref=typeof value==='number'?{repo:defaultRepository,number:value}:value;
 if(!ref||!/^[-.\w]+\/[-.\w]+$/.test(ref.repo)||!Number.isSafeInteger(ref.number)||ref.number<=0)throw Error('Invalid issue reference');
 const url=`https://github.com/${ref.repo}/issues/${ref.number}`;
 if(ref.url&&ref.url!==url)throw Error('Issue URL disagrees with owner/number');
 return {...ref,url};
}
export function issueKey(value, defaultRepository) {
 const ref=normalizeIssueRef(value,defaultRepository);return `${ref.repo}#${ref.number}`;
}
export function itemKey(item) {
 return item.content?.type==='Issue'?issueKey({repo:item.content.repository,number:item.content.number}):null;
}
export function validateActiveFields(item, repository, allowedAgents, allowedStatuses) {
 if(!allowedStatuses.has(item.status)||item.agent&&!allowedAgents.has(item.agent))throw Error('Invalid project status/agent');
 const active=Boolean(item.agent);
 if(active&&item.status==='Planned')throw Error('Active work cannot remain Planned');
 if(active||item.status!=='Planned') {
  const prefix=repository.split('/')[1]+'/';
  if(!item.path?.startsWith(prefix)||item.path.includes('\\')||item.path.split('/').includes('..')||item.path===prefix)throw Error('Missing or invalid repository-relative Path');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(item['start date']||''))throw Error('Missing first Start date');
 }
}
