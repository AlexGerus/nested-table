import { ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { animate, state, style, transition, trigger, } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { DemoMaterialModule } from './material.module';
import { CommonModule } from '@angular/common';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ]
})
export class AppComponent {
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChildren('subSort') subSort!: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<Address>>;
  @ViewChildren('subTables') subTables!: QueryList<MatTable<Block>>;

  dataSource!: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = ['name', 'email', 'phone'];
  innerDisplayedColumns = ['street', 'zipCode', 'city'];
  subBlockDisplayedColumns = ['name', 'level', 'unitnumber'];
  expandedElement!: User | null;
  expandedSubElement!: Address | null;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    USERS.forEach((user) => {
      if (
        user.addresses &&
        Array.isArray(user.addresses) &&
        user.addresses.length
      ) {
        const addresses: Address[] = [];

        user.addresses.forEach((address) => {
          if (Array.isArray(address.blocks)) {
            addresses.push({
              ...address,
              blocks: new MatTableDataSource(address.blocks),
            });
          }
        });

        this.usersData.push({
          ...user,
          addresses: new MatTableDataSource(addresses),
        });
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
  }

  toggleRow(element: User) {
    element.addresses &&
    (element.addresses as MatTableDataSource<Address>).data.length
      ? (this.expandedElement =
        this.expandedElement === element ? null : element)
      : null;

    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<Address>).sort =
          this.innerSort.toArray()[index])
    );
  }

  toggleSubRow(element: Address) {
    element.blocks && (element.blocks as MatTableDataSource<Block>).data.length
      ? (this.expandedSubElement =
        this.expandedSubElement === element ? null : element)
      : null;

    this.cd.detectChanges();
    this.subTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<Block>).sort =
          this.subSort.toArray()[index])
    );
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<Address>).filter = filterValue
          .trim()
          .toLowerCase())
    );
  }
}

export interface User {
  name: string;
  email: string;
  phone: string;
  addresses?: Address[] | MatTableDataSource<Address>;
}

export interface Address {
  street: string;
  zipCode: string;
  city: string;
  blocks?: Block[] | MatTableDataSource<Block>;
}

export interface Block {
  name: string;
  level: string;
  unitnumber: string;
}

export interface UserDataSource {
  name: string;
  email: string;
  phone: string;
  addresses?: MatTableDataSource<Address>;
}

const USERS: User[] = [
  {
    name: 'Mason',
    email: 'mason@test.com',
    phone: '9864785214',
    addresses: [
      {
        street: 'Street 1',
        zipCode: '78542',
        city: 'Kansas',
        blocks: [
          {
            name: 'Blk 11',
            level: 'Lvl 1',
            unitnumber: '01-01',
          },
          {
            name: 'Blk 22',
            level: 'Lvl 2',
            unitnumber: '02-01',
          },
        ],
      },
      {
        street: 'Street 2',
        zipCode: '78554',
        city: 'Texas',
        blocks: [
          {
            name: 'Blk 33',
            level: 'Lvl 3',
            unitnumber: '03-02',
          },
          {
            name: 'Blk 44',
            level: 'Lvl 4',
            unitnumber: '04-02',
          },
        ],
      },
    ],
  },
  {
    name: 'Jason',
    email: 'jason@test.com',
    phone: '7856452187',
    addresses: [
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Utah',
      },
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Ohio',
      },
    ],
  },
];