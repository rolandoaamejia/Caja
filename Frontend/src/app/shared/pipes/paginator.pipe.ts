import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "paginator",
})
export class PaginatorPipe implements PipeTransform {

  transform(array: any[], pageSize: number, page: number): any[] {

    if (!array) return [];
    if (!array.length) return [];
    pageSize = pageSize || 5;
    page = page || 1;
    --page;
    return array.slice(page * pageSize, (page + 1) * pageSize);
  }
}
