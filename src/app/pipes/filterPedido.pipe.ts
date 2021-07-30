import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../models/Pedido';

@Pipe({
  name: 'filterPedido'
})
export class FilterPipePedido implements PipeTransform {

  transform(value: any, arg= ''): any {
    if (arg === '' || arg.length < 1) return value;
    const resultPosts = [];
    for (const post of value) {
      if (post.fecha.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(post);
      };
    };
    return resultPosts;
  }


}