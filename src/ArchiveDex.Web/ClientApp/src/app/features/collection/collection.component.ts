import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TuiButton } from '@taiga-ui/core';
import { TranslatePipe } from '../../core/translate.pipe';
import { EmptyStateComponent, ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage, errorIsDuplicate } from '../../core/api-error-mapper';

interface CollectionEntry {
  id: string; cardId: string; cardName: string; cardLanguage: string | null;
  condition: string; quantity: number; purchasePrice: number | null;
  storageLocation: string | null; notes: string | null; frontImageUrl: string | null; dateAdded: string;
}
interface CollectionSet { setId: string; name: string; cardLanguage: string; uniqueCards: number; totalQuantity: number; }
interface CatalogCard { id: string; number: string; name: string; cardLanguage: string; imageUrl: string | null; }
interface DuplicateConflict { existingQuantity: number; proposedQuantity: number; }

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TranslatePipe, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <section class="collection">
      @if (detailId) {
        <header><button tuiButton appearance="secondary" size="s" type="button" (click)="back()">&larr; {{ 'collection.entries' | translate }}</button><h2>{{ 'collection.detail' | translate }}</h2></header>
        @if (loading) { <app-loading-state /> }
        @else if (loadError) { <app-error-state [message]="loadError" /> }
        @else if (detail) {
          <article class="detail">
            @if (detail.frontImageUrl) { <img [src]="detail.frontImageUrl" [alt]="detail.cardName" /> }
            <form (ngSubmit)="saveDetail()">
              <p class="eyebrow">{{ detail.cardLanguage }}</p><h3>{{ detail.cardName }}</h3>
              <label>{{ 'collection.condition' | translate }}<select [(ngModel)]="detail.condition" name="condition">@for (item of conditions; track item) { <option [value]="item">{{ item }}</option> }</select></label>
              <label>{{ 'collection.quantity' | translate }}<input type="number" min="1" [(ngModel)]="detail.quantity" name="quantity" /></label>
              <label>{{ 'collection.purchasePrice' | translate }}<input type="number" min="0" step=".01" [(ngModel)]="detail.purchasePrice" name="price" /></label>
              <label>{{ 'collection.storageLocation' | translate }}<input [(ngModel)]="detail.storageLocation" name="location" /></label>
              <label>{{ 'collection.notes' | translate }}<textarea [(ngModel)]="detail.notes" name="notes"></textarea></label>
              <button tuiButton type="submit" [disabled]="saving">{{ 'collection.save' | translate }}</button>
              @if (actionError) { <p class="error" role="alert">{{ actionError }}</p> }
              @if (success) { <p class="success" role="status">{{ 'collection.updated' | translate }}</p> }
            </form>
          </article>
        }
      } @else {
        <header><div><p class="eyebrow">{{ 'collection.inventory' | translate }}</p><h2>{{ 'collection.title' | translate }}</h2></div></header>
        @if (success) { <p class="success banner" role="status">{{ success }}</p> }

        <form class="filters" (ngSubmit)="searchEntries()">
          <label>{{ 'collection.search' | translate }}<input type="search" [(ngModel)]="query" name="query" /></label>
          <label>{{ 'collection.sets' | translate }}<select [(ngModel)]="setId" name="setId"><option value="">{{ 'collection.allSets' | translate }}</option>@for (set of sets; track set.setId + set.cardLanguage) { <option [value]="set.setId">{{ set.name }} ({{ set.cardLanguage }})</option> }</select></label>
          <label>{{ 'collection.language' | translate }}<select [(ngModel)]="language" name="language"><option value="">{{ 'collection.allLanguages' | translate }}</option>@for (item of languages; track item) { <option [value]="item">{{ item }}</option> }</select></label>
          <label>{{ 'collection.condition' | translate }}<select [(ngModel)]="conditionFilter" name="condition"><option value="">{{ 'collection.allConditions' | translate }}</option>@for (item of conditions; track item) { <option [value]="item">{{ item }}</option> }</select></label>
          <button tuiButton type="submit">{{ 'collection.search' | translate }}</button>
        </form>

        <div class="columns">
          <section class="add-panel">
            <h3>{{ 'collection.add' | translate }}</h3>
            <label>{{ 'collection.cardSearch' | translate }}<input type="search" [(ngModel)]="cardQuery" (ngModelChange)="searchCards()" [ngModelOptions]="{standalone:true}" /></label>
            @if (cardResults.length) {
              <div class="card-results">@for (card of cardResults; track card.id) { <button type="button" [class.selected]="selectedCard?.id === card.id" (click)="selectedCard = card"><strong>{{ card.name }}</strong><small>{{ card.number }} · {{ card.cardLanguage }}</small></button> }</div>
            }
            @if (selectedCard) { <p class="selected-card">{{ 'collection.selectedCard' | translate }}: <strong>{{ selectedCard.name }}</strong></p> }
            <form (ngSubmit)="addEntry()">
              <label>{{ 'collection.condition' | translate }}<select [(ngModel)]="formCondition" name="condition">@for (item of conditions; track item) { <option [value]="item">{{ item }}</option> }</select></label>
              <label>{{ 'collection.quantity' | translate }}<input type="number" min="1" [(ngModel)]="quantity" name="quantity" /></label>
              <label>{{ 'collection.purchasePrice' | translate }}<input type="number" min="0" step=".01" [(ngModel)]="purchasePrice" name="price" /></label>
              <label>{{ 'collection.storageLocation' | translate }}<input [(ngModel)]="storageLocation" name="location" /></label>
              <label>{{ 'collection.notes' | translate }}<textarea [(ngModel)]="notes" name="notes"></textarea></label>
              <button tuiButton type="submit" [disabled]="adding || !selectedCard">{{ 'collection.add' | translate }}</button>
              @if (actionError) { <p class="error" role="alert">{{ actionError }}</p> }
              @if (duplicate) { <div class="duplicate" role="alert"><p>{{ 'collection.duplicate' | translate }} ({{ duplicate.existingQuantity }} → {{ duplicate.proposedQuantity }})</p><button tuiButton size="s" type="button" (click)="resolve(true)">{{ 'collection.merge' | translate }}</button><button tuiButton size="s" appearance="secondary" type="button" (click)="resolve(false)">{{ 'collection.createSeparate' | translate }}</button></div> }
            </form>
          </section>

          <section class="entries">
            @if (loading) { <app-loading-state /> }
            @else if (loadError) { <app-error-state [message]="loadError" (retry)="load()" /> }
             @else { @for (entry of entries; track entry.id) { <article class="entry"><button class="entry-link" type="button" (click)="open(entry.id)">@if(entry.frontImageUrl){<img [src]="entry.frontImageUrl" [alt]="entry.cardName"/>}<span><strong>{{ entry.cardName }}</strong><small>{{ entry.cardLanguage }} · {{ entry.condition }} · ×{{ entry.quantity }}</small></span></button><button tuiButton type="button" size="s" appearance="secondary-destructive" (click)="deleteEntry(entry.id)">{{ 'collection.delete' | translate }}</button></article> } @empty { <app-empty-state [message]="'collection.noEntries' | translate" /> }
              @if (hasMore) { <button tuiButton appearance="secondary" type="button" class="load-more" [disabled]="loading" (click)="loadMore()">{{ 'catalog.loadMore' | translate }}</button> }
            }
          </section>
        </div>
      }
    </section>
  `,
  styles: [`
    :host{display:block}.collection{max-width:76rem}header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}h2,h3,p{margin-top:0}.eyebrow{margin-bottom:.25rem;color:var(--tui-text-secondary);text-transform:uppercase;letter-spacing:.08em;font-size:.75rem}
    .filters{display:grid;grid-template-columns:2fr repeat(3,1fr) auto;align-items:end;gap:.75rem;padding:1rem;background:var(--tui-background-neutral-1);border-radius:.75rem;margin-bottom:1.5rem}.columns{display:grid;grid-template-columns:minmax(17rem,23rem) 1fr;gap:2rem}.add-panel{padding:1rem;border:1px solid var(--tui-border-normal);border-radius:.75rem}.add-panel form,.detail form{display:flex;flex-direction:column;gap:.75rem}
    label{display:flex;flex-direction:column;gap:.3rem;font-size:.875rem}input,select,textarea{min-height:2.6rem;padding:.45rem .65rem;border:1px solid var(--tui-border-normal);border-radius:.4rem;background:var(--tui-background-base);color:inherit}textarea{min-height:4.5rem}.card-results{display:flex;flex-direction:column;max-height:12rem;overflow:auto;margin:.5rem 0}.card-results button{display:flex;justify-content:space-between;border:0;border-bottom:1px solid var(--tui-border-normal);padding:.55rem;background:none;color:inherit;text-align:left}.card-results button.selected{background:var(--tui-background-accent-1)}
    .entries{display:flex;flex-direction:column;gap:.6rem}.entry{display:flex;align-items:center;gap:.75rem;border:1px solid var(--tui-border-normal);border-radius:.6rem;padding:.55rem}.entry-link{display:flex;align-items:center;gap:.75rem;flex:1;border:0;background:none;color:inherit;text-align:left;cursor:pointer}.entry-link img{width:3rem;height:4.2rem;object-fit:contain}.entry-link span{display:flex;flex-direction:column}.entry-link small{color:var(--tui-text-secondary)}.detail{display:grid;grid-template-columns:minmax(13rem,19rem) minmax(18rem,28rem);gap:2rem}.detail img{width:100%;border-radius:.75rem}.error{color:var(--tui-text-negative)}.success{color:var(--tui-text-positive)}.banner{padding:.75rem;background:var(--tui-background-positive);border-radius:.5rem}.duplicate{display:flex;flex-wrap:wrap;gap:.5rem}    .duplicate p{flex-basis:100%}
    .load-more{display:block;margin:1rem auto 0}
    @media(max-width:55rem){.filters{grid-template-columns:1fr 1fr}.columns{grid-template-columns:1fr}}@media(max-width:38rem){.filters,.detail{grid-template-columns:1fr}}
  `],
})
export class CollectionComponent implements OnInit {
  readonly detailId: string | null;
  readonly conditions = ['NM', 'LP', 'MP', 'HP', 'DMG'];
  readonly languages = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ptBr', 'ru', 'zhHans', 'zhHant'];
  entries: CollectionEntry[] = []; sets: CollectionSet[] = []; detail: CollectionEntry | null = null;
  page = 1; hasMore = false;
  query=''; setId=''; language=''; conditionFilter=''; cardQuery=''; cardResults: CatalogCard[]=[]; selectedCard: CatalogCard|null=null;
  formCondition='NM'; quantity=1; purchasePrice:number|null=null; storageLocation=''; notes='';
  loading=false; adding=false; saving=false; loadError=''; actionError=''; success=''; duplicate:DuplicateConflict|null=null;

  constructor(private http:HttpClient, private route:ActivatedRoute, private router:Router, private cdr:ChangeDetectorRef){this.detailId=this.route.snapshot.paramMap.get('id');}
  ngOnInit():void{if(this.detailId) void this.loadDetail(); else void this.load();}

  async load():Promise<void>{this.page=1;this.loading=true;this.loadError='';try{const [entries,sets]=await Promise.all([this.fetchEntries(),firstValueFrom(this.http.get<CollectionSet[]>('/api/collection/sets'))]);this.entries=entries;this.sets=sets;}catch(error:unknown){this.loadError=userSafeErrorMessage(error,undefined,'Collection could not be loaded.');}finally{this.loading=false;this.cdr.markForCheck();}}
  private fetchEntries():Promise<CollectionEntry[]>{let params=new HttpParams().set('page',this.page);if(this.query.trim())params=params.set('q',this.query.trim());if(this.setId)params=params.set('setId',this.setId);if(this.language)params=params.set('cardLanguage',this.language);if(this.conditionFilter)params=params.set('condition',this.conditionFilter);return firstValueFrom(this.http.get<CollectionEntry[]>('/api/collection',{params}));}
  async searchEntries():Promise<void>{this.page=1;this.loading=true;try{this.entries=await this.fetchEntries();this.hasMore=this.entries.length===20;}catch(error:unknown){this.loadError=userSafeErrorMessage(error,undefined,'Collection could not be loaded.');}finally{this.loading=false;this.cdr.markForCheck();}}
  async loadMore():Promise<void>{this.page+=1;this.loading=true;try{const page=await this.fetchEntries();this.entries=[...this.entries,...page];this.hasMore=page.length===20;}catch(error:unknown){this.page=Math.max(1,this.page-1);this.actionError=userSafeErrorMessage(error,undefined,'Could not load more entries.');}finally{this.loading=false;this.cdr.markForCheck();}}
  async searchCards():Promise<void>{if(this.cardQuery.trim().length<2){this.cardResults=[];return;}try{const params=new HttpParams().set('q',this.cardQuery.trim()).set('page',1);this.cardResults=await firstValueFrom(this.http.get<CatalogCard[]>('/api/catalog/cards',{params}));}catch(error:unknown){this.actionError=userSafeErrorMessage(error,undefined,'Card search failed.');}finally{this.cdr.markForCheck();}}
  private createBody(flags:object={}){return{cardPrintId:this.selectedCard!.id,condition:this.formCondition,quantity:this.quantity,purchasePrice:this.purchasePrice,storageLocation:this.storageLocation||null,notes:this.notes||null,...flags};}
  async addEntry(flags:object={}):Promise<void>{if(!this.selectedCard||this.quantity<1||(this.purchasePrice!==null&&this.purchasePrice<0)){this.actionError='Check the selected card and values.';return;}this.adding=true;this.actionError='';this.duplicate=null;try{await firstValueFrom(this.http.post('/api/collection',this.createBody(flags)));this.success='Collection entry added.';this.selectedCard=null;this.cardResults=[];this.cardQuery='';await this.searchEntries();}catch(error:unknown){if(errorIsDuplicate(error))this.duplicate=(error as HttpErrorResponse).error as DuplicateConflict;else this.actionError=userSafeErrorMessage(error,undefined,'Entry could not be added.');}finally{this.adding=false;this.cdr.markForCheck();}}
  resolve(merge:boolean):void{void this.addEntry(merge?{mergeDuplicate:true}:{forceCreate:true});}
  open(id:string):void{void this.router.navigate(['/collection/card',id]);} back():void{void this.router.navigate(['/collection']);}
  private async loadDetail():Promise<void>{this.loading=true;try{this.detail=await firstValueFrom(this.http.get<CollectionEntry>(`/api/collection/${this.detailId}`));}catch(error:unknown){this.loadError=userSafeErrorMessage(error,undefined,'Collection entry could not be loaded.');}finally{this.loading=false;this.cdr.markForCheck();}}
  async saveDetail():Promise<void>{if(!this.detail)return;this.saving=true;this.actionError='';try{this.detail=await firstValueFrom(this.http.put<CollectionEntry>(`/api/collection/${this.detail.id}`,{condition:this.detail.condition,quantity:this.detail.quantity,purchasePrice:this.detail.purchasePrice,storageLocation:this.detail.storageLocation,notes:this.detail.notes}));this.success='updated';}catch(error:unknown){this.actionError=userSafeErrorMessage(error,undefined,'Update failed.');}finally{this.saving=false;this.cdr.markForCheck();}}
  async deleteEntry(id:string):Promise<void>{try{await firstValueFrom(this.http.delete(`/api/collection/${id}`));this.success='Collection entry deleted.';await this.searchEntries();}catch(error:unknown){this.actionError=userSafeErrorMessage(error,undefined,'Delete failed.');}}
}
